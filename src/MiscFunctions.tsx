const ApiProvider = ():string => {
  let proto:string = "http";
  let host:string = "localhost";

  // HTTP protocol to be used HTTP or HTTPS, defaults to HTTP if not set
  if (typeof process.env.REACT_APP_API_HOST_PROTOCOL !== "undefined") {
    if ( ["http", "https"].includes(process.env.REACT_APP_API_HOST_PROTOCOL.toLowerCase()) ) {
      proto = process.env.REACT_APP_API_HOST_PROTOCOL.toLowerCase();
    }
  }
  
  // Hostname, defaults to 'localhost' if not set
  if (typeof process.env.REACT_APP_API_HOST_NAME !== "undefined") {
    host = process.env.REACT_APP_API_HOST_NAME;
  }

  // If the ports are different than 80 or 443, then use the specified port
  if (typeof process.env.REACT_APP_API_HOST_PORT !== "undefined") {
    if ( ! ["80", "443"].includes(process.env.REACT_APP_API_HOST_PORT) ) {
      console.log(`${proto}://${host}:${process.env.REACT_APP_API_HOST_PORT}/api`);
      return `${proto}://${host}:${process.env.REACT_APP_API_HOST_PORT}/api`;
    }
  }

  return `${proto}://${host}/api`;
};

const FilterByRow = async (id:any, resource:any, record:any) => {
  const API_URL:string = ApiProvider();
  let filter:string = "";

  await fetch(`${API_URL}/${resource}/${id}`)
  .then( (response:any) => response.json())
  .then( (data:any) => {
    filter = encodeURI(JSON.stringify({ _id: {"$in" : data.ids } }));
  });

  return `/reports/?filter=${filter}`;
}

export {
  ApiProvider,
  FilterByRow
}