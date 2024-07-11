import { useComponent } from "./Component.tsx";

interface Props {
  /**
   * @format color-input
   */
  backgroundColor?: string;
}

export async function action(props: Props, req: Request): Promise<Props> {
  const form = await req.formData();
  const newColor = form.get("color") as string;
  return { ...props, backgroundColor: newColor };
}

export function loader(props: Props) {
  return props;
}

export default function ColorCard({
  backgroundColor = "#ffffff",
}: Props) {
  return (
    <div
      style={{ backgroundColor }}
      class="p-8 rounded-lg shadow-md flex justify-center items-center"
    >
      <form
        hx-post={useComponent(import.meta.url, { backgroundColor })}
        hx-target="this"
        hx-swap="outerHTML"
        class="flex items-center"
      >
        <input
          type="color"
          name="color"
          value={backgroundColor}
          class="mr-4"
        />
        <button type="submit" class="btn btn-primary">
          <span class="inline [.htmx-request_&]:hidden">Change Color</span>
          <span class="hidden [.htmx-request_&]:inline loading loading-spinner" />
        </button>
      </form>
    </div>
  );
}