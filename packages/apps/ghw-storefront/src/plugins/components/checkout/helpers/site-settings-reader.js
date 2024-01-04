export default {
  getSiteTitle(state) {
    const {site} = state.clientRepository.context.global;
    const {name} = state.siteRepository.sites[site];
    return name;
  }
};
