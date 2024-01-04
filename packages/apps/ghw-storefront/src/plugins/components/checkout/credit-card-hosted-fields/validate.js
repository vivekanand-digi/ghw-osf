export const validateFields = fields => {
  let invalidFields = [];
  Object.keys(fields).forEach(function (field) {
    if (!fields[field].isValid) {
      invalidFields.push(field);
    }
  });
  return invalidFields;
};

// export const validateInput = element => {
//   // very basic validation, if the
//   // fields are empty, mark them
//   // as invalid, if not, mark them
//   // as valid

//   if (!element.val().trim()) {
//     setValidityClasses(element, false);

//     return false;
//   }

//   setValidityClasses(element, true);

//   return true;
// };
