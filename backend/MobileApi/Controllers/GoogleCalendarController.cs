using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobileApi.Services;

namespace MobileApi.Controllers;

// ⚠️ LƯU Ý: Biến 'env' được inject từ IWebHostEnvironment (DI tự động).
// Hành vi của callback thay đổi tùy môi trường:
//   - Development (launchSettings.json): Trả về JSON để test Swagger dễ dàng.
//   - Production (server thật): Redirect về Deep Link của Mobile App.
// Để chuyển sang Production, đổi ASPNETCORE_ENVIRONMENT=Production trong biến môi trường server.
[ApiController]
[Route("api/google")]
public class GoogleCalendarController(IGoogleCalendarService googleCalendarService, IConfiguration configuration, IWebHostEnvironment env) : ControllerBase
{
    private readonly IGoogleCalendarService _googleCalendarService = googleCalendarService;
    private readonly string _postAuthRedirect = configuration["Google__PostAuthRedirect"] ?? "orbit://calendar/connected";

    // Endpoint 1: Lấy URL để Mobile App mở trình duyệt đăng nhập Google
    [Authorize]
    [HttpGet("auth-url")]
    public IActionResult GetAuthUrl()
    {
        // Lấy UserId từ JWT Token của người dùng đang đăng nhập
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

        var userId = Guid.Parse(userIdClaim);
        var url = _googleCalendarService.GetAuthUrl(userId);

        return Ok(new { data = url });
    }


    // Endpoint 2: Nơi Google gửi kết quả (code) về sau khi User đồng ý
    [HttpGet("callback")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string state)
    {
        if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
        {
            return BadRequest("Thiếu thông tin xác thực từ Google.");
        }

        // 'state' chính là UserId chúng ta đã gửi đi ở bước trước
        if (!Guid.TryParse(state, out var userId))
        {
            return BadRequest("Dữ liệu trạng thái không hợp lệ.");
        }

        // Đổi code lấy Token và lưu vào Database
        var success = await _googleCalendarService.ExchangeCodeForTokenAsync(userId, code);

        if (!success)
        {
            return BadRequest("Không thể xác thực với Google.");
        }

        // Dev mode: Trả về JSON để test Swagger cho sướng
        if (env.IsDevelopment())
        {
            return Ok(new
            {
                Status = "Thành công",
                Message = "Token đã lưu vào DB. Đang ở mode Dev nên không Redirect.",
                DeepLink_For_App = _postAuthRedirect
            });
        }

        // Production: Điều hướng người dùng quay lại Mobile App qua Deep Link
        return Redirect(_postAuthRedirect);
    }
}
