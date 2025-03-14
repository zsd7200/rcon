type LoadingProps = {
  fullScreen?: boolean,
}

export default function Loading({ fullScreen }: LoadingProps) {
  if (fullScreen === undefined) fullScreen = false;

  return (
    <div className={`flex items-center justify-center pt-[20px] mb-8 mt-2 ${(fullScreen) ? 'w-screen h-screen fixed top-0 right-0' : ''}`}>
      <div className="animate-loader-pulse w-[20px] h-[20px] rounded-[100%] bg-[rgba(152,199,103,1)] [box-shadow:0_0_0_0_rgba(152,199,103,.4)]"></div>
    </div>
  );
}