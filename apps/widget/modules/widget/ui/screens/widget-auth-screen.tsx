import { WidgetHeader } from "../components/widget.-header";
import { 
    Form ,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@workspace/ui/components/form"
import { z } from "zod"
import { api } from "@workspace/backend/_generated/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useMutation } from "convex/react";
import { userAgent } from "next/server";
import { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, organizationIdAtom } from "../../atoms/widget-atoms";

const formSchema = z.object({
    name : z.string().min(1, 'Name is required'),
    email : z.string().email("Invalid email address")
})

const organizationId = "123";

export const WidgetAuthScreen = () => {

    const organizationId = useAtomValue(organizationIdAtom);
    const setContactSessionId = useSetAtom(
        contactSessionIdAtomFamily(organizationId || "")
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            email : "",
            name : "",
        }
    });

    const createContaxtSession = useMutation(api.public.contact_sessions.create)

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        if(!organizationId) return;
        const metaData  : Doc<"contactSession">["metadata"]= {
            userAgent : navigator.userAgent,
            language : navigator.language,
            languages : navigator.languages?.join(""),
            platform : navigator.platform,
            vendor : navigator.vendor,
            screenResolution : `${screen.width}x${screen.height}`,
            viewportSize : `${window.innerWidth}x${window.innerHeight}`,
            timezone : Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset : new Date().getTimezoneOffset(),
            cookieEnabled : navigator.cookieEnabled,
            referrer : document.referrer || "direct",
            currentUrl : window.location.href,
        }

        const expiresAt = Date.now() + 1000 * 60 * 60 * 24;

        const contactSessionId = await createContaxtSession({
            ...values,
            organizationId,
            metadata : metaData,
            expiresAt
        })

        setContactSessionId(contactSessionId as Id<"contactSession">);
    }

    return(
        <>
        <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
            <p className="text-3xl">
            Hi there! 👋
            </p>
            <p className="text-lg">
            Let&apos;s get you started!
            </p>
        </div>
        </WidgetHeader>
        <Form {...form}>
            <form className="flex flex-col flex-1 gap-y-4 p-4"
                  onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                 className="h-10 bg-background"
                                 placeholder="eg. John Doe"
                                 type="text"
                                 {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                 className="h-10 bg-background"
                                 placeholder="eg. JohnDoe@example.com"
                                 type="email"
                                 {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    
                    <Button
                    disabled={form.formState.isSubmitting}
                    size="lg"
                    type="submit">
                        Continue    
                    </Button>
            </form>
        </Form>
        </>
    )
}