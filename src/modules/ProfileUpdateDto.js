export const buildProfileUpdateDto = (userData) => ({
    firstName: userData.firstName,
    lastName: userData.lastName,
    middleName: userData.patronymic,
    preferredTheme: userData.theme,
    preferredLanguage: userData.language,
    startPage: userData.startPage,
  });
  