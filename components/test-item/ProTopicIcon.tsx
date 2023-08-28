import { memo, PropsWithoutRef } from "react";

const ProTopicIcon = memo((props: PropsWithoutRef<{ id: string }>) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.0771 2.17134C16.5278 2.06037 17.0003 2.33527 17.1832 2.81362C17.3701 3.30205 17.2245 3.88464 16.8158 4.15534C16.664 4.25622 16.608 4.37224 16.5691 4.55298C16.3587 5.52739 16.1411 6.49969 15.9235 7.47197C15.8657 7.73028 15.8078 7.98859 15.7502 8.24693C15.7338 8.32057 15.7176 8.3942 15.7015 8.4678C15.6633 8.64206 15.6252 8.81607 15.5836 8.98925C15.5096 9.29778 15.3703 9.42389 15.0901 9.44574C15.0384 9.44978 14.9861 9.44951 14.9342 9.44924C14.9213 9.44917 14.9084 9.44911 14.8955 9.44911C10.9131 9.46003 6.92987 9.47012 2.94747 9.47937C2.55203 9.48105 2.42359 9.36252 2.32707 8.92452C2.15086 8.12841 1.97441 7.33256 1.79799 6.53683C1.65565 5.89483 1.51333 5.25291 1.37117 4.61099C1.3693 4.60314 1.36721 4.5953 1.36512 4.58745C1.35937 4.56587 1.35363 4.5443 1.35248 4.52272C1.3447 4.36635 1.28476 4.27304 1.14854 4.20158C0.865971 4.05362 0.732082 3.76022 0.638672 3.4416V3.07675C0.722741 2.74468 0.863636 2.46053 1.14387 2.28735C1.57511 2.02422 2.08965 2.14528 2.39401 2.58579C2.67969 2.99857 2.65167 3.59965 2.3294 3.99141C2.30673 4.01812 2.28527 4.04549 2.25966 4.07814C2.25626 4.08248 2.25279 4.08691 2.24923 4.09145C2.26085 4.1062 2.27171 4.12071 2.28229 4.13485C2.30008 4.15861 2.31709 4.18134 2.33563 4.20242C2.43038 4.30998 2.52507 4.41764 2.61978 4.52531C2.90558 4.85022 3.19147 5.17525 3.47913 5.49791C4.29414 6.41005 5.48512 6.32514 6.18181 5.29867C6.56134 4.73895 6.93811 4.1768 7.31497 3.61451C7.60207 3.18615 7.88922 2.75772 8.17768 2.33023C8.2345 2.24616 8.24852 2.19319 8.18391 2.0982C7.86865 1.63414 7.91613 1.00784 8.2851 0.627848C8.66497 0.236091 9.23011 0.23441 9.61231 0.622804C9.98362 1.00027 10.0311 1.62574 9.7244 2.09399L9.72431 2.09413C9.70566 2.12351 9.687 2.1529 9.66135 2.19235C9.82794 2.44288 9.99433 2.69362 10.1607 2.94436C10.3271 3.19509 10.4935 3.44582 10.6601 3.69633L11.6899 5.24486C12.4138 6.33354 13.5994 6.43106 14.4556 5.47101C14.7833 5.10341 15.1105 4.73526 15.4422 4.36198C15.5171 4.27769 15.5922 4.19313 15.6676 4.10826C15.4606 3.87708 15.322 3.61899 15.3119 3.28944C15.2963 2.75729 15.6171 2.28483 16.0771 2.17134ZM9.9243 10.5975H14.8758C15.3079 10.5975 15.4729 10.8102 15.4737 11.3667C15.4737 11.4939 15.4738 11.6211 15.4738 11.7484C15.474 12.0033 15.4742 12.2583 15.4737 12.5134C15.4721 13.0052 15.3001 13.2296 14.9202 13.2296H8.96218H3.06875C2.63984 13.2296 2.48338 13.0287 2.48338 12.4764C2.4826 12.0872 2.4826 11.6979 2.48338 11.3087C2.48493 10.8203 2.65852 10.5975 3.04073 10.5975H9.9243Z" fill={`url(#paint0_linear_1951_30${props.id})`} />
    <defs>
      <linearGradient id={`paint0_linear_1951_30${props.id}`} x1="8.95117" y1="0.332764" x2="8.95117" y2="16.924" gradientUnits="userSpaceOnUse">
        <stop offset="0.328125" stopColor="#FFBA28" />
        <stop offset="1" stopColor="#FFDD65" />
      </linearGradient>
    </defs>
  </svg>
});

export default ProTopicIcon;