const StudentLayout = ({ children }) => {
  return (
    <div style={{ border: "3px solid blue", padding: 20 }}>
      <h2>STUDENT LAYOUT</h2>
      <div>{children}</div>
    </div>
  );
};

export default StudentLayout;