export function generateRandomString(length) {
    const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * symbols.length);
      randomString += symbols.charAt(randomIndex);
    }
  
    return randomString;
}

export const loadingSpinner = {
  showLoading: function () {
    console.log("biba");
    let i = 1;

    const updateSpinner = () => {
      if (i === 5) {
        clearInterval(this.intervalId);
        document.getElementById('plane5base').classList.add("d-none");
        document.getElementById('plane5active').classList.remove("d-none");
        document.getElementById('plane1base').classList.remove("d-none");
        document.getElementById('plane1active').classList.add("d-none");
        i = 1;
      } else {
        document.getElementById('plane' + i + 'base').classList.add("d-none");
        document.getElementById('plane' + i + 'active').classList.remove("d-none");
        document.getElementById('plane' + (i + 1) + 'base').classList.remove("d-none");
        document.getElementById('plane' + (i + 1) + 'active').classList.add("d-none");
        i++;
      }
    };

    // Execute the updateSpinner function every 10 milliseconds
    this.intervalId = setInterval(updateSpinner, 100);
  },

  hideLoading: function () {
    // Stop the interval to hide the loading spinner
    clearInterval(this.intervalId);
    document.getElementById('Psection6').innerText = "GOT SCAMMED"
  }
};
