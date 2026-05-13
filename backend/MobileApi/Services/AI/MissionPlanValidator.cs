using FluentValidation;

namespace MobileApi.Services.AI;

public class MissionPlanValidator : AbstractValidator<MissionPlanDto>
{
    public MissionPlanValidator()
    {
        RuleFor(x => x.Intent)
            .Must(i => i == "clarify" || i == "plan")
            .WithMessage("intent must be 'clarify' or 'plan'");

        RuleFor(x => x.Message).NotEmpty();

        When(x => x.Intent == "plan", () =>
        {
            RuleFor(x => x.Plan).NotNull().WithMessage("plan is required when intent is 'plan'");

            When(x => x.Plan != null, () =>
            {
                RuleFor(x => x.Plan!.Title).NotEmpty();
                RuleFor(x => x.Plan!.StartDate).LessThan(x => x.Plan!.EndDate)
                    .WithMessage("startDate must be before endDate");
                RuleFor(x => x.Plan!.Tasks)
                    .NotEmpty()
                    .Must(t => t.Count <= 30).WithMessage("Maximum 30 tasks allowed");
                RuleForEach(x => x.Plan!.Tasks).ChildRules(t =>
                {
                    t.RuleFor(x => x.Title).NotEmpty();
                    t.RuleFor(x => x.EstimatedDurationMinutes).GreaterThan(0);
                });
                RuleFor(x => x.Plan!.Tasks)
                    .Must(IsContiguousFrom1).WithMessage("sequenceOrder must be contiguous starting from 1");
            });
        });
    }

    private static bool IsContiguousFrom1(List<MissionTaskPlanDto> tasks)
    {
        var sorted = tasks.Select(t => t.SequenceOrder).OrderBy(x => x).ToList();
        for (var i = 0; i < sorted.Count; i++)
            if (sorted[i] != i + 1) return false;
        return true;
    }
}
