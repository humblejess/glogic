// Cloudflare Pages Functions - 使用 Cloudflare Workers 格式
export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  try {
    const { ranking, language, sessionId } = await request.json();
    
    if (!ranking || !Array.isArray(ranking) || ranking.length !== 6) {
      return new Response(JSON.stringify({ error: 'Invalid ranking data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = env.DB; // D1 数据库实例
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 从 Cloudflare 请求头获取 IP 地址（CF-Connecting-IP）
    const ipAddress = request.headers.get('CF-Connecting-IP') || '';

    // 插入排序记录（包含时间戳）
    const createdAt = new Date().toISOString();
    const result = await db.prepare(
      `INSERT INTO user_rankings (session_id, ranking_order, language, user_agent, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      sessionId || 'unknown',
      JSON.stringify(ranking),
      language || 'en',
      request.headers.get('user-agent') || '',
      ipAddress,
      createdAt
    ).run();

    return new Response(JSON.stringify({ 
      success: true, 
      id: result.meta.last_row_id 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving ranking:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

