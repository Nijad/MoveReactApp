using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Security.Principal;

namespace MoveReactApp.Server.Helper
{
    public class RoleAuthorization : IClaimsTransformation
    {
        public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var identity = (ClaimsIdentity)principal.Identity;
            //IEnumerable<Claim> s = Dss(identity);
            IEnumerable<string> s = SSS(identity);
            if (identity.IsAuthenticated && identity.HasClaim(c => c.Type == identity.RoleClaimType))
            {
                //if (IsUserInGroup(identity, "\\INTERNTET\\\\khourynj"))
                if(s.Any(g => g.Equals("INTERNET\\Domain Users", StringComparison.OrdinalIgnoreCase)))
                    identity.AddClaim(new Claim(identity.RoleClaimType, "AllowReactApp"));
            }
            return Task.FromResult(principal);
        }

        private IEnumerable<Claim> Dss(ClaimsIdentity? identity)
        {
            IEnumerable<Claim> s = identity.Claims
                .Where(c => c.Type == ClaimTypes.Name);
                //.Select(c => new SecurityIdentifier(c.Value));
                //.Translate(typeof(NTAccount)));
            return s;
        }

        private IEnumerable<string> SSS(ClaimsIdentity? identity)
        {
            IEnumerable<string> s = identity.Claims
                .Where(c => c.Type == ClaimTypes.GroupSid)
                .Select(c => new SecurityIdentifier(c.Value)
                .Translate(typeof(NTAccount)).ToString());
            return s;
        }

        private bool IsUserInGroup(ClaimsIdentity identity, string groupName)
        {
            return identity.Claims
                .Where(c => c.Type == ClaimTypes.GroupSid)
                .Select(c => new SecurityIdentifier(c.Value)
                .Translate(typeof(NTAccount)).ToString())
                .Any(g => g.Equals(groupName, StringComparison.OrdinalIgnoreCase));
        }
    }
}
