import { Separator } from '@/components/ui/separator'
import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
const AboutUsPage = () => {
  return (
    <>
      <PageTitle className="text-primary" route={getAppRoute(location.pathname)} />
      <div className="px-4 py-8 space-y-6">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Who We Are</h2>
          <p className="text-muted-foreground max-w-4xl">
            We are a team of dedicated professionals committed to transforming how communities
            prepare for and respond to disasters. Our platform empowers emergency management teams
            to act swiftly and efficiently in real-time, ensuring that critical resources and
            information are delivered exactly when and where they are needed most.
          </p>
          <Separator />
        </section>

        <section className="space-y-6 md:grid md:grid-cols-2 md:gap-12 md:items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
            <p className="text-muted-foreground">
              Our mission is to enhance disaster response through intelligent, event-driven systems
              that prioritize speed, coordination, and reliability. We believe that technology
              should play a central role in protecting lives and infrastructure during times of
              crisis.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">What We Do</h2>
            <p className="text-muted-foreground">
              Our platform uses event-driven architecture to coordinate incident reporting, resource
              allocation, and real-time notifications. It’s built to handle high-pressure situations
              and enable rapid, data-driven response at scale.
            </p>
          </div>
        </section>

        <Separator />

        <section className="space-y-6 md:grid md:grid-cols-2 md:gap-12 md:items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">Our Approach</h2>
            <p className="text-muted-foreground">
              At the core of our system is an intelligent event engine powered by proven design
              patterns. From automated dispatch to live status updates, our system ensures modular,
              responsive operations across all modules.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">Built for the Future</h2>
            <p className="text-muted-foreground">
              As disasters grow more complex, our tools adapt. We’re equipping emergency responders
              with scalable, automated systems to improve readiness, visibility, and decision-making
              in critical moments.
            </p>
          </div>
        </section>

        <Separator />
        <section className="flex items-center justify-center gap-6 mt-4">
          <img src="/icon.svg" className="w-32 h-32" />
          <h1 className="text-4xl font-bold text-primary">Unity Response</h1>
        </section>
      </div>
    </>
  )
}

export default AboutUsPage
