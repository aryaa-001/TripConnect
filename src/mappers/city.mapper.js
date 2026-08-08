const toCityResponse = (city) => {
  return {
    id: city.id,
    name: city.name,
    state: city.state,
  };
};

export {toCityResponse};