const AdminLayout = ({ children }) => {
  return (
    <div style={{ border: "3px solid red", padding: 20 }}>
      <h2>ADMIN LAYOUT</h2>
      <div>{children}</div>
    </div>
  );
};

export default AdminLayout;