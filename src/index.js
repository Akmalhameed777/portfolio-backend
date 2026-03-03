module.exports = {
  async bootstrap({ strapi }) {
    console.log('🔧 Setting public permissions...');
    
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        console.error('❌ Public role not found');
        return;
      }

      const permissionsToSet = [
        { action: 'api::project.project.find' },
        { action: 'api::project.project.findOne' },
        { action: 'api::project.project.create' },
        { action: 'api::blog-post.blog-post.find' },
        { action: 'api::blog-post.blog-post.findOne' },
        { action: 'api::blog-post.blog-post.create' },
        { action: 'api::about.about.find' },
        { action: 'api::contact-message.contact-message.create' },
];

      for (const perm of permissionsToSet) {
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({
            where: {
              action: perm.action,
              role: publicRole.id,
            },
          });

        if (!existing) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              ...perm,
              role: publicRole.id,
            },
          });
          console.log(`✅ Created permission: ${perm.action}`);
        } else {
          console.log(`ℹ️  Permission already exists: ${perm.action}`);
        }
      }
      
      console.log('✅ All public permissions set!');
    } catch (error) {
      console.error('❌ Error setting permissions:', error);
    }
  },
};