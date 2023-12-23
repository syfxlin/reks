import { DocumentElement } from "@keystatic/core";

export interface TocData {
  name: string;
  slug: string;
  link: string;
  step: number;
  level: number;
  children: ReadonlyArray<TocData>;
}

export interface DocumentData {
  document: ReadonlyArray<DocumentElement>;
  headings: ReadonlyArray<TocData>;
  contents: string;
  excerpts: string;
}

export interface PaginationData<T> {
  page: (index: number) => ReadonlyArray<T>;
  items: ReadonlyArray<ReadonlyArray<T>>;
  pages: number;
  total: number;
}

export const document = (body: ReadonlyArray<DocumentElement>): DocumentData => {
  const visit = (items: ReadonlyArray<any>) => {
    const headings: Array<any> = [];
    const contents: Array<string> = [];
    for (const item of items) {
      if (item.text) {
        contents.push(item.text as string);
      } else if (item.type === "heading") {
        const results = visit(item.children as Array<any>);
        const name = results.contents.join("");
        const slug = name;
        const link = `#${encodeURIComponent(name)}`;
        const level = item.level;
        headings.push({ name, slug, link, level });
        headings.push(...results.headings);
        contents.push(...results.contents);
      } else if (item.children) {
        const results = visit(item.children as Array<any>);
        headings.push(...results.headings);
        contents.push(...results.contents);
      }
    }
    return { headings, contents };
  };

  const build = (headings: any[], parent: any = { level: 0, children: [] }) => {
    parent.children = parent.children ?? [];
    while (headings.length) {
      const heading = headings.shift();
      if (heading.level > parent.level) {
        parent.children.push(build(headings, heading));
      } else {
        headings.unshift(heading);
        return parent;
      }
    }
    return parent;
  };

  const results = visit(body);

  const document = body;
  const headings = build(results.headings.map((h, i) => ({ ...h, step: i }))).children;
  const contents = results.contents.join(" ");
  const excerpts = contents.length <= 140 ? contents : contents.substring(0, 140) + "...";

  return { document, headings, contents, excerpts };
};

export const pagination = <T = any>(size: number, items: ReadonlyArray<T>): PaginationData<T> => {
  if (size <= 0) {
    throw new Error(`size must be greater than zero.`);
  }
  const pages: T[][] = [];
  for (let i = 0; i < Math.ceil(items.length / size); i++) {
    pages.push(items.slice(i * size, i * size + size));
  }
  return {
    page: (index: number) => pages[index - 1],
    items: pages,
    pages: pages.length,
    total: items.length,
  };
};
