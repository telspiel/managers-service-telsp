class Endpoints {
    constructor() {

      this.serverAddress = "http://100.64.195.116:2282/Manager-Services/";

      // this.serverAddress = "http://100.64.195.110:2083/resellerservices/";
      
      this.endpoints = {
        login: "telSpiel/login",
        dashboard: "telSpiel/dashboard",
        userSummaryReport: "telSpiel/userSummaryReport",
        availableCredit: "telSpiel/availableCredit",
      };
    }
    get(name) {
      return `${this.serverAddress}/${this.endpoints[name]}`;
    }
  
    validateResponse(data) {
      if (data && typeof data === "object" && data.constructor === Object) {
        switch (data.code) {
          case 1001:
            window.location.pathname !== "/login"
              ? (window.location.href = "/login")
              : alert(data.message || "Login failed. Please try again!");
            return false;
          default:
            return data;
        }
      } else {
        alert("Something went wrong. Please try again!");
        return false;
      }
    }
  }
  
  export default new Endpoints();
  