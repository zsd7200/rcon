export const getToastStyles = (icon?: string, mode?: string | undefined) => {
  mode = mode ?? 'dark';

  const darkToast = {
    borderRadius: '10px',
    background: '#1f1f1f',
    color: '#fff',
  };

  const lightToast = {
    borderRadius: '10px',
    background: '#E5E7EB',
    color: '#4B5563',
  };

  return {
    icon: icon ?? '',
    style: (mode === 'dark') ? darkToast: lightToast,
  };
}