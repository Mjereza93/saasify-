import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Cloudflare from 'cloudflare';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const cta_link = formData.get('cta_link') as string;
    const cta_text = formData.get('cta_text') as string;
    const userId = formData.get('user_id') as string;

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}-${file.name}`;

    // 1. Upload to Backblaze B2
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    });

    await s3Client.send(putObjectCommand);

    const b2FileUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;

    // 2. Create video in Cloudflare Stream from URL
    const streamVideo = await cloudflare.stream.videos.create({
      url: b2FileUrl,
      title,
      // We can add more options here like watermarks, thumbnails, etc.
    });

    // 3. Create ad record in Supabase
    const { data: ad, error } = await supabase
      .from('ads')
      .insert({
        user_id: userId,
        video_url: streamVideo.playback.hls,
        thumbnail_url: streamVideo.thumbnail,
        title,
        description,
        cta_link,
        cta_text,
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
