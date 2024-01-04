const LocalStorageService = {
  // Function to store data in local storage
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Function to retrieve data from local storage
  getItem: key => {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;
  },

  // Function to remove data from local storage
  removeItem: key => {
    localStorage.removeItem(key);
  }
};

export default LocalStorageService;
