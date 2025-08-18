import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Cloudflare from 'cloudflare';
import { v4 as uuidv4 } from 'uuid';

// This assumes you have these env vars set up in your .env.local
const s3Client = new S3Client({
  endpoint: `https://s3.${process.env.B2_REGION}.backblazeb2.com`,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY!,
  },
});

const cloudflare = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const geotag = formData.get('geotag') as string | null;
    const floating_cta_config = formData.get('floating_cta_config') as string | null; // JSON string

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }
     if (file.size > 100 * 1024 * 1024) { // 100MB limit
      return NextResponse.json({ error: 'File size exceeds 100MB' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${session.user.id}/${uuidv4()}-${file.name}`;

    // 1. Upload to Backblaze B2
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    }));

    const b2FileUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;

    // 2. Create video in Cloudflare Stream from URL
    const streamVideo = await cloudflare.stream.videos.create({
      url: b2FileUrl,
      meta: {
        title,
        description,
        userId: session.user.id,
      },
      creator: session.user.id, // Link the video to a creator
    });

    // 3. Create ad record in Supabase
    const { data: ad, error } = await supabase
      .from('ads')
      .insert({
        user_id: session.user.id,
        video_url: streamVideo.uid, // Store the Stream UID instead of the full HLS URL
        thumbnail_url: streamVideo.thumbnail,
        title,
        description,
        geotag: geotag ? JSON.parse(geotag) : null,
        floating_cta_config: floating_cta_config ? JSON.parse(floating_cta_config) : null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}
