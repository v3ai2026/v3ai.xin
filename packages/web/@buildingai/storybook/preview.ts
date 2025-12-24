import type { Preview } from "@storybook-vue/nuxt";

/**
 * Shared BuildingAI Storybook preview configuration
 * This configuration provides standard preview settings for all BuildingAI projects
 */
export const sharedPreview: Preview = {
    parameters: {
        // Control panel configuration
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
            expanded: true,
            sort: "requiredFirst",
        },

        // Documentation configuration
        docs: {
            toc: true,
            source: {
                state: "open",
            },
        },

        // Viewport configuration
        viewport: {
            viewports: {
                mobile: {
                    name: "Mobile",
                    styles: {
                        width: "375px",
                        height: "667px",
                    },
                },
                tablet: {
                    name: "Tablet",
                    styles: {
                        width: "768px",
                        height: "1024px",
                    },
                },
                desktop: {
                    name: "Desktop",
                    styles: {
                        width: "1024px",
                        height: "768px",
                    },
                },
                wide: {
                    name: "Wide",
                    styles: {
                        width: "1440px",
                        height: "900px",
                    },
                },
            },
            defaultViewport: "desktop",
        },

        // Background configuration
        backgrounds: {
            default: "light",
            values: [
                {
                    name: "light",
                    value: "#ffffff",
                },
                {
                    name: "dark",
                    value: "#1a1a1a",
                },
                {
                    name: "gray",
                    value: "#f5f5f5",
                },
            ],
        },

        // Layout configuration
        layout: "centered",

        // Actions configuration
        actions: {
            argTypesRegex: "^on[A-Z].*",
        },

        // Options configuration
        options: {
            storySort: {
                order: ["Introduction", "Components", "Pages", "Examples", "*"],
            },
        },
    },

    // Global decorators
    decorators: [
        (story) => ({
            components: { story },
            template: `
        <div class="p-4">
          <story />
        </div>
      `,
        }),
    ],

    // Global arg types
    argTypes: {
        // Common arg types for all components
        className: {
            control: "text",
            description: "CSS class name",
        },
        id: {
            control: "text",
            description: "Element ID",
        },
        disabled: {
            control: "boolean",
            description: "Whether the component is disabled",
        },
        loading: {
            control: "boolean",
            description: "Whether the component is in loading state",
        },
    },
};

export default sharedPreview;
