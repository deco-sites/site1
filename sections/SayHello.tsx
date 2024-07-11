import { useComponent } from "./Component.tsx";
import type { HTMLWidget } from 'apps/admin/widgets.ts';
import type { AppContext } from "../apps/site.ts";

interface Props {
  /**
   * @format rich-text
   */
  title?: string;
  /**
   * @format rich-text
   * @title Input Placeholder
   */
  inputPlaceholder?: string;
  /**
   * @format rich-text
   * @title Button Text
   */
  buttonText?: string;
  content?: HTMLWidget;
}

export async function action(
  props: Props,
  req: Request,
  ctx: AppContext
): Promise<Props> {
  const form = await req.formData();
  const response = `${form.get("response") ?? ""}`;
  if (!response) {
    return { ...props, content: { __html: `You didn't answer.` } };
  }
  return { ...props, content: { __html: `You answered: ${response}` } };
}

export function loader(props: Props) {
  return props;
}

export default function FormSection({
  title = "Say something",
  inputPlaceholder = "Enter your text here...",
  buttonText = "Submit",
  content = { __html: "<p>Result will appear here.</p>" },
}: Props) {
  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <form
        hx-post={useComponent(import.meta.url, { title, inputPlaceholder, buttonText, content })}
        hx-target="#response"
        hx-swap="outerHTML"
      >
        <input
          type="text"
          name="response"
          placeholder={inputPlaceholder}
          className="input input-bordered w-full mb-4"
        />
        <button type="submit" className="btn btn-primary">
          {buttonText}
        </button>
      </form>
      <div id="response" className="mt-12" dangerouslySetInnerHTML={content} />
    </div>
  );
}
