export default function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center pt-[20px]">
      <div className="animate-loader-pulse w-[20px] h-[20px] rounded-[100%] bg-[rgba(152,199,103,1)] [box-shadow:0_0_0_0_rgba(152,199,103,.4)]"></div>
    </div>
  );
}