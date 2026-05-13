using MobileApi.DTOs.Responses;
using MobileApi.Models;

namespace MobileApi.Extensions;

public static class MissionTaskMappingExtensions
{
    public static MissionTaskResponse ToResponse(this MissionTask t) => new()
    {
        Id = t.Id,
        HabitTemplateId = t.HabitTemplateId,
        Title = t.Title,
        Description = t.Description,
        SequenceOrder = t.SequenceOrder,
        EstimatedDuration = t.EstimatedDuration
    };
}