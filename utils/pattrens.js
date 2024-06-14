const namePattern = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^\+?1?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).+$/;
export{namePattern,emailPattern,phonePattern,passwordPattern}