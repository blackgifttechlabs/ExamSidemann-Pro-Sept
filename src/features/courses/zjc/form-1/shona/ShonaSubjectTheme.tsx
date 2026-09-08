import React from 'react';

const shonaThemeStyles = `
  .shona-subject-theme {
    min-width: 0;
    overflow-x: clip;
  }

  .shona-subject-theme header {
    background: linear-gradient(135deg, #087f5b 0%, #069669 52%, #04a777 100%) !important;
    border-bottom-color: rgba(6, 120, 85, 0.35) !important;
    box-shadow: 0 8px 30px rgba(0, 100, 70, 0.12) !important;
    text-align: center;
  }

  .shona-subject-theme header > div {
    margin-left: auto;
    margin-right: auto;
    max-width: 64rem;
  }

  .shona-subject-theme header h1 {
    color: #fff !important;
  }

  .shona-subject-theme header p {
    margin-left: auto;
    margin-right: auto;
    color: #ecfdf5 !important;
  }

  .shona-subject-theme header [class*='max-w-xl'],
  .shona-subject-theme header [class*='max-w-2xl'] {
    margin-left: auto;
    margin-right: auto;
  }

  .shona-subject-theme header input {
    color: #1f2937 !important;
  }

  .shona-subject-theme header input::placeholder {
    color: #9ca3af !important;
  }

  .shona-subject-theme > div > [class*='sticky'] {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  }

  .shona-subject-theme [class*='rounded-xl'],
  .shona-subject-theme [class*='rounded-2xl'] {
    border-radius: 0.75rem;
  }

  @media (max-width: 640px) {
    .shona-subject-theme header {
      padding-top: 2rem !important;
      padding-bottom: 2rem !important;
    }

    .shona-subject-theme header h1 {
      font-size: 2rem !important;
      line-height: 1.1;
    }

    .shona-subject-theme header p {
      font-size: 0.95rem !important;
    }

    .shona-subject-theme header input {
      min-width: 0;
    }

    .shona-subject-theme main,
    .shona-subject-theme section {
      min-width: 0;
    }
  }
`;

export const ShonaSubjectTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="shona-subject-theme min-w-0">
    <style>{shonaThemeStyles}</style>
    {children}
  </div>
);
