export default function InterceptedLoginModal() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 0,
        top: 0,
        opacity: 0.7,
      }}
    >
      <div
        style={{
          width: "400px",
          height: "300px",
          paddingTop: "30px",
          backgroundColor: "white",
          borderRadius: "12px",
          fontSize: "20px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
        }}
      >
        가로챈 로그인 모달
      </div>
    </div>
  );
}
