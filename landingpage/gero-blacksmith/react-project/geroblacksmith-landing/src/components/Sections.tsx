export default function Section({id,title,children}:{id:string,title:string,children:React.ReactNode}) {
    return (<section id={id}>
        <h2>{title}<i>01</i></h2>
        {children}
        <div className="col">
          <p>Gero Blacksmith is an artist and music producer working in electronic music. The name suggests a forge:
            sounds get heated, hit, bent and cooled into something new.</p>
          <p>Most of the work happens in a personal studio, where tracks are written, tested and reshaped. Some end up
            as mixes, some as releases, some as live jams recorded in one take.</p>
          <p className="note">Add your own story here: where you are from, when you started, what first pulled you into
            sound.</p>
        </div>
      </section>);
      

}