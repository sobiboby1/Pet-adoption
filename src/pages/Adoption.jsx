{/* --- HIGH VISIBILITY STYLED DOWNLOAD BUTTON --- */}
<div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
  <a 
    href="https://drive.google.com/uc?export=download&id=1msqIns_dJB0RTJJ--leoxgQdS9ZBLNK4"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#ff7a59',
      color: '#ffffff',
      padding: '10px 22px',
      borderRadius: '30px',
      fontSize: '0.9rem',
      fontWeight: '700',
      textDecoration: 'none',
      boxShadow: '0 4px 10px rgba(255, 122, 89, 0.3)',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = '#e56847';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 15px rgba(255, 122, 89, 0.4)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = '#ff7a59';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 122, 89, 0.3)';
    }}
  >
    <Download size={16} strokeWidth={2.5} color="#ffffff" />
    Download Android App (APK)
  </a>
</div>