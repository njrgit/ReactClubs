using AutoMapper;
using Domain;

namespace Application.Clubs
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Club,ClubDto>();
            CreateMap<UserClub,AttendeeDto>()
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName));
            
        }
    }
}