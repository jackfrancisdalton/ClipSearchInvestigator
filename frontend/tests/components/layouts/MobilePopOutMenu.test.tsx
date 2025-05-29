import { render, screen, fireEvent } from "@testing-library/react";
import MobilePopOutMenu from "../../../src/components/Layouts/MobilePopOutMenu.js";

describe("MobilePopOutMenu", () => {
    const mockToggleSidebar = vi.fn();

    const renderComponent = (isOpen: boolean, children: React.ReactNode = <div>Test Content</div>) => {
        render(
            <MobilePopOutMenu isOpen={isOpen} toggleSidebar={mockToggleSidebar}>
                {children}
            </MobilePopOutMenu>
        );
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should render the menu container with correct classes when open", () => {
        renderComponent(true);
        const container = screen.getByTestId("mobile-pop-out-menu_container");
        expect(container).toHaveClass("translate-y-0 h-full");
    });

    it("should render the menu container with correct classes when closed", () => {
        renderComponent(false);
        const container = screen.getByTestId("mobile-pop-out-menu_container");
        expect(container).toHaveClass("translate-y-full h-0");
    });

    it("should render children inside the content section", () => {
        renderComponent(true, <div data-testid="child-content">Child Content</div>);
        const content = screen.getByTestId("mobile-pop-out-menu_content");
        const childContent = screen.getByTestId("child-content");
        expect(content).toContainElement(childContent);
    });

    it("should call toggleSidebar when the button is clicked", () => {
        renderComponent(true);
        const button = screen.getByTestId("mobile-pop-out-menu_toggle-button");
        fireEvent.click(button);
        expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it("should display 'Close' on the button when the menu is open", () => {
        renderComponent(true);
        const button = screen.getByTestId("mobile-pop-out-menu_toggle-button");
        expect(button).toHaveTextContent("Close");
    });

    it("should display 'Open' on the button when the menu is closed", () => {
        renderComponent(false);
        const button = screen.getByTestId("mobile-pop-out-menu_toggle-button");
        expect(button).toHaveTextContent("Open");
    });
});