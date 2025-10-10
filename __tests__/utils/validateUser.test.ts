import { validateUser } from "@/utils/validateUser";

const INITIAL_USER_DATA = {
  userid: "abc123",
  password: "password123",
  confirmPassword: "password123",
  email: "mockuser@gmail.com",
};
let user = { ...INITIAL_USER_DATA };

describe("validateUser 유틸 함수", () => {
  beforeEach(() => {
    user = { ...INITIAL_USER_DATA };
  });
  it("아이디가 five5일 때 아이디 입력 길이 검증 실패 메세지를 출력합니다.", () => {
    const unverifiedLengthUserid = "five5";
    const validateErrorMessage = validateUser({
      ...user,
      userid: unverifiedLengthUserid,
    });
    expect(validateErrorMessage).toEqual(
      "아이디는 6자 ~ 20자 이내로 입력해야 합니다.",
    );
  });
  it("비밀번호가 abcd1234일 때 비밀번호 입력 길이 검증 실패 메세지를 출력합니다.", () => {
    const unverifiedLengthPassword = "abc123";
    const validateErrorMessage = validateUser({
      ...user,
      password: unverifiedLengthPassword,
    });
    expect(validateErrorMessage).toEqual(
      "비밀번호는 8자 ~ 24자 이내로 입력해야 합니다.",
    );
  });
  it("비밀번호가 password일 때 비밀번호 정규식 검증 실패 메세지를 출력합니다.", () => {
    const unmatchRegexpPassword = "password";
    const validateErrorMessage = validateUser({
      ...user,
      password: unmatchRegexpPassword,
    });
    expect(validateErrorMessage).toEqual(
      "비밀번호는 숫자와 소문자가 적어도 1개 이상 포함되어야 합니다.",
    );
  });
  it("비밀번호와 비밀번호 확인 양식이 일치하지 않으면 검증 실패 메세지를 출력합니다.", () => {
    const unmatchPassword = "abcd1234";
    const unmatchConfirmPassword = "abcd5678";
    const validateErrorMessage = validateUser({
      ...user,
      password: unmatchPassword,
      confirmPassword: unmatchConfirmPassword,
    });
    expect(validateErrorMessage).toEqual(
      "비밀번호 입력란과 비밀번호 확인란이 일치하지 않습니다.",
    );
  });
  it("이메일이 abc123@gmailcom일 때 이메일 정규식 검증 실패 메세지를 출력합니다.", () => {
    const unmatchRegexpEmail = "abc123@gmailcom";
    const validateErrorMessage = validateUser({
      ...user,
      email: unmatchRegexpEmail,
    });
    expect(validateErrorMessage).toEqual(
      "이메일 형식을 올바르게 작성해주세요.",
    );
  });
  it("모든 계정 양식이 검증에 통과할 경우 빈 문자열을 출력합니다.", () => {
    const validateErrorMessage = validateUser(user);
    expect(validateErrorMessage).toEqual("");
  });
});
