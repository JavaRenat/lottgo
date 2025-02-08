export const img_300 = "https://image.tmdb.org/t/p/w300";

// contentModal and singleContent
export const unavailable =
  "https://www.movienewz.com/img/films/poster-holder.jpg";

// contentModal
export const unavailableLandscape =
  "https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg";


const BackendConfig = {
    useMockData: true,  // Переключение между моковыми данными и API
    backEndApi: "https://backend-api.com",
    apiVersion: "v1",
};

BackendConfig.currentGamesEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/currentGames`;
BackendConfig.finishedGamesEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/finishedGames`;
BackendConfig.getLocationEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/getLocation`;
BackendConfig.userEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/user`;
BackendConfig.settingsEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/settings`;
BackendConfig.citiesEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/cities`;
BackendConfig.servicesEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/services`;
BackendConfig.playEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/play`; // списание баланса и счетчик игр должен быть увеличен, учесть что денег может не хватать, проверять что игра актуальна (по дате) и сейчас в игре
BackendConfig.modelEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/models`; // POST добавляет новую модель, GET получит модели по критериям UPDATE обновляет существующую
BackendConfig.checkModelLimitEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/checkModelLimit`; // check if user with id able to create a model
BackendConfig.approveModelEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/approveModel` // change status of model with id to status=approved а также создает Game со статусом new
BackendConfig.deleteModelEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/deleteModel` // delete model with model id
BackendConfig.createGameEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/createGame` // create game with model id

export default BackendConfig;