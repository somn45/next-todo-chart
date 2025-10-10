interface UserFormData {
  userid: string;
  password: string;
  confirmPassword?: string;
  email?: string;
}

export const validateUser = (userFormData: UserFormData) => {
  const passwordRegex = new RegExp(/(?=.*[a-z])(?=.*\d).+/);
  const emailRegex = new RegExp(/^\w{3,}\@\w{3,}\.\w{2,3}$/);

  const { userid, password, confirmPassword, email } = userFormData;
  if (userid.length <= 5 || userid.length >= 21)
    return "아이디는 6자 ~ 20자 이내로 입력해야 합니다.";
  if (!passwordRegex.test(password))
    return "비밀번호는 숫자와 소문자가 적어도 1개 이상 포함되어야 합니다.";
  if (password.length <= 7 || userid.length >= 25)
    return "비밀번호는 8자 ~ 24자 이내로 입력해야 합니다.";
  if (confirmPassword && password !== confirmPassword)
    return "비밀번호 입력란과 비밀번호 확인란이 일치하지 않습니다.";

  if (email && !emailRegex.test(email))
    return "이메일 형식을 올바르게 작성해주세요.";
  return "";
};
