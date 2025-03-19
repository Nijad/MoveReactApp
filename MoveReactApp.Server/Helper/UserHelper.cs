namespace MoveReactApp.Server.Helper
{
    public class UserHelper : IUserHelper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserHelper(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUserName()
        {
            string username = "";
            username += _httpContextAccessor.HttpContext?.User.Identity?.Name;
            if (!string.IsNullOrEmpty(username))
                username = username.Substring(username.LastIndexOf('\\') + 1);
            return username;
        }
    }
}
