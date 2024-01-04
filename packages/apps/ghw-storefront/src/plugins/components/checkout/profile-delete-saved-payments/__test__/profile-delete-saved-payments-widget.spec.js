import React from 'react';
import {act, cleanup, render, screen, waitForElement} from '@oracle-cx-commerce/test/component/custom-render';
import {createMockStore} from '@oracle-cx-commerce/test/component/create-mock-store';
import {preloadComponents} from '@oracle-cx-commerce/commerce-utils/react';
import Widget from '@oracle-cx-commerce/react-components/widget';

export const ProfileDeleteSavedPayments = () => import('../index');

describe('ProfileDeleteSavedPayments renders correctly and shows after changing visible state', () => {
  /**
   * Reference to dynamic imported comps to resolve and preload.
   */
  const comps = {ProfileDeleteSavedPayments};
  beforeAll(async () => {
    /**
     * Resolves all components(dynamic) and updates reference to actual implementation
     * Not required if a widget is not a dynamic import reference.
     */
    await preloadComponents(comps);
  });
  beforeEach(() => {
    // Runs before every test.
  });
  afterEach(() => {
    // Runs after every test.
    cleanup(); // Cleans up the window.document with empty body after every test.
  });

  it('ProfileDeleteSavedPayments works as expected', async done => {
    /**
     * The state structure that will be used by widget to render.
     * Add more relevant repositories to the state.
     */
    const state = {
      pageRepository: {
        widgets: {
          dsWidgetInstance: {
            id: 'dsWidgetInstance',
            componentId: 'ProfileDeleteSavedPayments',
            regions: []
          }
        }
      }
    };
    /**
     * Create a mock store with the state.
     */
    const mockStore = createMockStore(state);

    /**
     * Renders the widget with store and component providers OOTB.
     */
    render(<Widget widgetId="dsWidgetInstance" />, mockStore, comps);

    /**
     * Wait for render to finish and make sure the rendered DOM has the required labels
     */
    await waitForElement(() => screen.getByText(/Base/));

    done();
  });
});
