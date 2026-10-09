export default function AvatarIniciales({ iniciales, size = "md" }: { iniciales: string; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-accent font-semibold text-primary-foreground ${
        size === "md" ? "size-9 text-[13px]" : "size-8 text-[12px]"
      }`}
    >
      {iniciales}
    </span>
  );
}
