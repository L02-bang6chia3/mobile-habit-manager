namespace MobileApi.Common.Exceptions;

public class ApplicationException : Exception
{
    public ApplicationException(string message) : base(message)
    {
    }

    public ApplicationException(string message, Exception innerException) 
        : base(message, innerException)
    {
    }
}

public class ValidationException : ApplicationException
{
    public ValidationException(string message) : base(message)
    {
    }

    public ValidationException(string fieldName, string message) 
        : base($"{fieldName}: {message}")
    {
    }
}

public class NotFoundException : ApplicationException
{
    public NotFoundException(string resourceName, object id) 
        : base($"{resourceName} with id {id} not found")
    {
    }

    public NotFoundException(string message) : base(message)
    {
    }
}

public class UnauthorizedException : ApplicationException
{
    public UnauthorizedException(string message = "Unauthorized") : base(message)
    {
    }
}
