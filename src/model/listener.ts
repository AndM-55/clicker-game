/**
 * listener interface for any views that must listen to updates from a domain
 * model instance
 */
export default interface Listener {
    notify (): void;
}