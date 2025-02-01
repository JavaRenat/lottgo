export const img_300 = "https://image.tmdb.org/t/p/w300";
export const img_500 = "https://image.tmdb.org/t/p/w500";

// contentModal and singleContent
export const unavailable =
  "https://www.movienewz.com/img/films/poster-holder.jpg";

// contentModal
export const unavailableLandscape =
  "https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg";

// For Carousel
export const noPicture =
  "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg";



const BackendConfig = {
    useMockData: true,  // Переключение между моковыми данными и API
    backEndApi: "https://backend-api.com",
    apiVersion: "v1",
};

BackendConfig.currentGamesEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/currentGames`;
BackendConfig.getLocationEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/getLocation`;
BackendConfig.userEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/user`;

export default BackendConfig;