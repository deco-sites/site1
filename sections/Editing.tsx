import { useComponent } from "./Component.tsx";
import type { AppContext } from "../apps/site.ts";

interface Props {
  /**
   * @format rich-text
   */
  title?: string;
  /**
   * @format text-area
   */
  placeholder?: string;
  /**
   * @format text-area
   */
  buttonText?: string;
  /**
   * @format rich-text
   */
  listTitle?: string;
  /**
   * @format color-input
   */
  listColor?: string;
}

export async function action(
  props: Props,
  req: Request,
  ctx: AppContext
): Promise<Props> {
  const form = await req.formData();
  const newItem = form.get("newItem") as string;
  const items = (props.items || []).concat(newItem);
  return { ...props, items };
}

export function loader(props: Props) {
  return props;
}

export default function DynamicList({
  title = "Add to List",
  placeholder = "Enter item...",
  buttonText = "Add",
  listTitle = "List",
  listColor = "#000000",
  items = [],
}: Props & { items?: string[] }) {
  return (
    <section>
      <div class="container mx-auto py-12 relative">
        <h2 class="text-3xl text-center font-bold mb-4">{title}</h2>
        <form
          hx-post={useComponent(import.meta.url, { title, placeholder, buttonText, listTitle, listColor, items })}
          hx-target="closest section"
          hx-swap="outerHTML"
          class="flex justify-center gap-2"
        >
          <input
            type="text"
            name="newItem"
            placeholder={placeholder}
            class="input input-bordered mb-4"
          />
          <button type="submit" class="btn btn-primary">
            <span class="inline [.htmx-request_&]:hidden">{buttonText}</span>
            <span class="hidden [.htmx-request_&]:inline loading loading-spinner" />
          </button>
        </form>
        <div class="mt-5">
          <h3 class="text-2xl font-bold mb-2" style={{ color: listColor }}>
            {listTitle}
          </h3>
          <ul class="list-disc pl-6">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}