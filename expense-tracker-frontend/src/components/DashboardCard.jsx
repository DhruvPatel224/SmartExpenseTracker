import React from 'react';

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className={`card card-hover h-100 overflow-hidden border-0 border-start border-${color} border-4 shadow-sm`}>
      <div className="card-body p-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-muted text-uppercase fw-semibold mb-0" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
            {title}
          </h6>
          <div className={`rounded-3 bg-${color} bg-opacity-10 text-${color} d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '48px' }}>
            <i className={`bi ${icon} fs-4`}></i>
          </div>
        </div>
        <h3 className="fw-bold text-dark mb-0">{value}</h3>
      </div>
    </div>
  );
}

export default DashboardCard;
