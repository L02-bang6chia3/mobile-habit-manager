using Microsoft.AspNetCore.Mvc;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

/*
 * ĐÂY LÀ PHẦN TƯƠNG ĐƯƠNG VỚI routes/ VÀ controllers/ TRONG EXPRESS.JS
 * 
 * Thay vì: 
 *   const router = express.Router();
 *   router.post('/habits', habitController.createHabit);
 *   module.exports = router;
 * 
 * Chúng ta định nghĩa Base Route ở [Route("api/[controller]")]
 * Chữ [controller] sẽ tự động lấy tên class "Habits" (bỏ chữ Controller đi).
 * Vậy URL sẽ là: /api/habits
 */

[ApiController]
[Route("api/[controller]")] // Tương đương router.use('/api/habits')
public class HabitsController : ControllerBase
{
    private readonly IHabitService _habitService;

    // Kéo Service vào (Dependency Injection)
    public HabitsController(IHabitService habitService)
    {
        _habitService = habitService;
    }

    // Tương đương: router.post('/', (req, res) => { ... })
    [HttpPost]
    public async Task<IActionResult> CreateHabit([FromBody] CreateHabitRequest reqBody)
    {
        // Gọi logic xử lý từ Service
        var habitId = await _habitService.CreateHabitAsync(reqBody);

        // Trả về response (Giống res.status(200).json({...}))
        return Ok(new { message = "Tạo thói quen thành công!", data = habitId });
    }
}
