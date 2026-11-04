export const Input = ({ id, label, type = 'text', placeholder = '' }) => `
  <div class="mb-4">
    <label for="${id}" class="block text-sm font-medium text-slate-300 mb-1 font-sans">
      ${label}
    </label>
    <input 
      type="${type}" 
      id="${id}" 
      placeholder="${placeholder}" 
      required
      class="w-full bg-tech-card border border-tech-border text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent transition-all font-sans placeholder-slate-500" 
    />
  </div>
`;

export const Button = ({ id, text, variant = 'primary', type = 'button' }) => {
  const baseClass = "w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 font-sans shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-tech-dark focus:ring-tech-cyan active:scale-[0.98]";
  
  const variants = {
    primary: "bg-tech-cyan hover:bg-tech-cyanHover text-slate-900 shadow-tech-cyan/20 hover:shadow-tech-cyan/40",
    secondary: "bg-transparent border border-tech-border text-slate-300 hover:text-white hover:bg-slate-800"
  };

  return `
    <button type="${type}" id="${id}" class="${baseClass} ${variants[variant]}">
      ${text}
    </button>
  `;
};