<script context="module">
    import {storePopup, toastStore} from "@skeletonlabs/skeleton";
    import {arrow, autoUpdate, computePosition, flip, offset, shift} from "@floating-ui/dom";

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});

    export const toast = {
        message: "",
        hideDismiss: true,
        timeout: 10000,
        background: "bg-green-500",
        position: "r",
        padding: "p-4",
    };

    export const defaultToastStore = toastStore;

</script>