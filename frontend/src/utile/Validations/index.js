const validator = {

  email: {
    rules: [
      {
        test: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i,
        message: 'Please Enter Valid Email',
      },
    ],
    errors: [],
    valid: false,
    state: '',
  },
  password: {
    rules: [
      {
        test: (value) => {
          return value.length >= 8;
        },
        message: 'Password can not be < 8 characters',
      }
    ],
    errors: [],
    valid: false,
    state: ''
  },
  store: {
    rules: [
      {
        test: /^[a-z0-9A-Z_]+$/i,
        message: 'Invalid Store Name',
      },
    ],
    errors: [],
    valid: false,
    state: '',
  },
};

export default validator;