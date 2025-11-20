/**
 * Discord 服务器配置
 * 
 * ===== 方式 A：邀请链接（推荐，最简单） =====
 * 如何获取邀请链接：
 * 1. 在 Discord 中，右键点击服务器名称 → "Invite People"
 * 2. 点击 "Edit invite link" 或创建新链接
 * 3. 设置：
 *    - Expire after: "Never" (永久链接)
 *    - Max uses: "No limit" (无限制)
 * 4. 复制生成的链接并替换下面的 DISCORD_INVITE_URL
 * 
 * ===== 方式 B：Discord Widget（可选，显示在线成员） =====
 * 如何获取 Server ID：
 * 1. 在 Discord 中，进入 Server Settings → Widget
 * 2. 启用 "Enable Server Widget"
 * 3. Server ID 会显示在 Widget 设置页面
 * 4. 或者：右键点击服务器名称 → "Copy Server ID"（需要开启开发者模式）
 * 
 * 如果不需要 Widget，可以设置 ENABLE_WIDGET = false
 */

// ===== 方式 A：邀请链接（必需） =====
export const DISCORD_INVITE_URL = 'https://discord.gg/b4x8YxKs5A';

// ===== 方式 B：Discord Widget（可选） =====
export const ENABLE_WIDGET = false; // 设置为 true 以启用 Widget
export const DISCORD_SERVER_ID = 'YOUR_SERVER_ID'; // 你的 Discord 服务器 ID

// 完整的 Discord 配置
export const discordConfig = {
  inviteUrl: DISCORD_INVITE_URL,
  serverName: 'Gender Logic',
  enableWidget: ENABLE_WIDGET,
  serverId: DISCORD_SERVER_ID,
  widgetUrl: ENABLE_WIDGET 
    ? `https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=light`
    : null,
};

