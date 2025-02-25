namespace eDocBrowser.Services
{
    public interface IImpersonationService
    {
        void RunImpersonated(string userName, string domainName, string password, Action action);
        Task RunImpersonatedAsync(string userName, string domainName, string password, Func<Task> action);
    }
}
