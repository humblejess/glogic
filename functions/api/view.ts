// Cloudflare Pages Functions - 使用 Cloudflare Workers 格式
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  try {
    const { sessionId, language } = await request.json();
    const pagePath = url.searchParams.get('path') || '/';
    
    const db = env.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 从 Cloudflare 请求头获取 IP 地址（CF-Connecting-IP）
    // 这是 Cloudflare 提供的真实客户端 IP 地址
    const ipAddress = request.headers.get('CF-Connecting-IP') || '';

    // 从 Cloudflare 请求头获取国家代码（CF-IPCountry）
    // 这是 Cloudflare 自动添加的，基于 IP 地址的地理位置
    // 格式：ISO 3166-1 alpha-2 国家代码（如 US, CN, FR, GB 等）
    const countryCode = request.headers.get('CF-IPCountry') || 'XX'; // XX 表示未知

    // 插入访问记录（包含时间戳）
    const createdAt = new Date().toISOString();
    await db.prepare(
      `INSERT INTO page_views (session_id, page_path, language, referrer, user_agent, country_code, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      sessionId || 'unknown',
      pagePath,
      language || 'en',
      request.headers.get('referer') || '',
      request.headers.get('user-agent') || '',
      countryCode,
      ipAddress,
      createdAt
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error saving page view:', error);
    // 返回详细错误信息用于调试
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      stack: error?.stack || ''
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

