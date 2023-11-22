export const log = (info1, info2) => {
  if (window.location.host.includes("localhost")) {
    //console.log(info1, info2);
  }
};

export const getCurrentUser = () => {
  let user = null;
  try {
    user =
      localStorage.getItem("extension") != null
        ? localStorage.getItem("extension")
        : null;
  } catch (error) {
    log(">>>>: src/Utils/Utils.js  : getCurrentUser -> error", error);
    user = null;
  }
  return user;
};

export const setCurrentUser = (user) => {
  try {
    if (user) {
      log("USER:", user);
      localStorage.setItem("extension", user);
    } else {
      localStorage.removeItem("extension");
    }
  } catch (error) {
    log(">>>>: src/Utils/Utils.js : setCurrentUser -> error", error);
  }
};
